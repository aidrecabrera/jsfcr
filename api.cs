using System.Net.Http;
using System.Text.Json;
using BioMatcher.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SourceAFIS;
using Supabase;
using Supabase.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<Supabase.Client>(_ =>
    new Supabase.Client(
        "https://gadqtzxkoakpcijfysts.supabase.co",
        "eyJhbGciOiJIUzI1NiIsnJlZiI6ImdhZHF0enhrb2FrcGNpamZ5c3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5NDY0NzQsImV4cCI6MjAzMzUyMjQ3NH0.klYkd734ly8Uc_tNNVmP6kVfLQQx8Q8GCRPXdVBMACc",
        new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true
        })
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

async Task<List<Subject>> LoadDBAsync(Client supabase, HttpClient httpClient)
{
    var response = await supabase.From<StudentFingerprint>()
        .Select("*")
        .Get();

    var subjects = new List<Subject>();

    foreach (var f in response.Models)
    {
        try
        {
            var imageBytes = await httpClient.GetByteArrayAsync(f.ImgUrl);
            var template = new FingerprintTemplate(new FingerprintImage(imageBytes));
            subjects.Add(new Subject(
                (int)f.StudentId,
                f.ImgUrl,
                template
            ));
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Failed to download image from {f.ImgUrl}. Error: {ex.Message}");
            continue;
        }
    }

    return subjects;
}


// Method to identify top N matches
List<(string Url, double Confidence)> IdentifyTopMatches(FingerprintTemplate probe, IEnumerable<Subject> candidates, int topN)
{
    var matcher = new FingerprintMatcher(probe);
    return candidates
        .Select(c => new { Candidate = c.Name, Similarity = matcher.Match(c.Template) })
        .OrderByDescending(x => x.Similarity)
        .Take(topN)
        .Select(x => (Url: x.Candidate, Confidence: x.Similarity))
        .ToList();
}

// Endpoint to fetch fingerprints from Supabase
app.MapGet("/supabase", async (Client supabase) =>
{
    var response = await supabase.From<StudentFingerprint>()
        .Select("*")
        .Get();
    var dto = response.Models.Select(f => new StudentFingerprintDto
    {
        FingerprintMetadataId = f.FingerprintMetadataId,
        Hash = f.Hash,
        ImgUrl = f.ImgUrl,
        ObjectId = f.ObjectId,
        Finger = f.Finger.ToString(),
        StudentId = f.StudentId
    }).ToList();

    return Results.Json(dto);
});

// Endpoint for 1:N fingerprint matching
app.MapPost("/match-url", async (HttpContext context, Client supabase) =>
{
    using var reader = new StreamReader(context.Request.Body);
    var body = await reader.ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);

    var imageUrl = jsonDocument.RootElement.GetProperty("imageUrl").GetString();
    int topN = jsonDocument.RootElement.TryGetProperty("topN", out var topNProperty)
        ? topNProperty.GetInt32()
        : 20;
    if (string.IsNullOrEmpty(imageUrl))
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        await context.Response.WriteAsync("No image URL provided");
        return;
    }

    var httpClient = new HttpClient();

    // Download the fingerprint image from the provided URL
    byte[] imageBytes;
    try
    {
        imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
    }
    catch (Exception)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        await context.Response.WriteAsync("Invalid image URL or unable to download image");
        return;
    }

    // Create a probe fingerprint template
    var probe = new FingerprintTemplate(new FingerprintImage(imageBytes));

    // Load candidate fingerprints from the database
    var candidates = await LoadDBAsync(supabase, httpClient);

    // Identify the top N matches
    var topMatches = IdentifyTopMatches(probe, candidates, topN);

    // Return the results as JSON
    var result = new
    {
        fingerprint = imageUrl,
        suspects = topMatches.Select((match, index) => new
        {
            suspect_id = index + 1,
            url = match.Url,
            confidence = match.Confidence
        }).ToList()
    };

    context.Response.ContentType = "application/json";
    await context.Response.WriteAsync(JsonSerializer.Serialize(result));
});


app.Run();

// DTO class for StudentFingerprint
public class StudentFingerprintDto
{
    public long FingerprintMetadataId { get; set; }
    public string Hash { get; set; }
    public string ImgUrl { get; set; }
    public Guid ObjectId { get; set; }
    public string Finger { get; set; }
    public long StudentId { get; set; }
}

// Subject class to represent a fingerprint subject
public record Subject(int Id, string Name, FingerprintTemplate Template);
