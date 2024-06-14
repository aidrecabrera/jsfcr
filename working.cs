using SourceAFIS;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/matcher", async (HttpRequest request) =>
    {
        JsonDocument jsonDocument;
        try
        {
            jsonDocument = await JsonDocument.ParseAsync(request.Body);
        }
        catch (JsonException)
        {
            return Results.BadRequest("Invalid JSON format.");
        }

        var root = jsonDocument.RootElement;

        if (!root.TryGetProperty("candidate", out var candidateUrlElement) ||
            !root.TryGetProperty("probe", out var probeUrlElement))
        {
            return Results.BadRequest("Both candidate and probe image URLs are required.");
        }

        var candidateUrl = candidateUrlElement.GetString();
        var probeUrl = probeUrlElement.GetString();

        if (string.IsNullOrEmpty(candidateUrl) || string.IsNullOrEmpty(probeUrl))
        {
            return Results.BadRequest("Both candidate and probe image URLs must be valid strings.");
        }

        async Task<byte[]> DownloadImage(string url)
        {
            try
            {
                var handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true
                };

                using var httpClient = new HttpClient(handler);
                var response = await httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsByteArrayAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error downloading image from {url}: {ex.Message}");
                return null;
            }
        }

        async Task<FingerprintTemplate> CreateTemplateFromUrl(string url)
        {
            var imageBytes = await DownloadImage(url);
            if (imageBytes == null)
            {
                throw new InvalidOperationException($"Failed to download image from {url}");
            }

            var image = new FingerprintImage(imageBytes);
            return new FingerprintTemplate(image);
        }

        try
        {
            var candidateTemplate = await CreateTemplateFromUrl(candidateUrl);
            var probeTemplate = await CreateTemplateFromUrl(probeUrl);

            var matcher = new FingerprintMatcher(probeTemplate);
            double similarity = matcher.Match(candidateTemplate);

            double threshold = 40;
            bool matches = similarity >= threshold;

            return Results.Ok(new { similarity, matches });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing request: {ex.Message}");
            return Results.Problem("Internal Server Error. Unable to process the request.");
        }
    })
    .WithName("MatchFingerprints")
    .WithOpenApi();

app.Run();
