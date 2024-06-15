using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BioMatcher.Model
{
    public class StudentFingerprintDto
    {
        public long FingerprintMetadataId { get; set; }
        public string Hash { get; set; }
        public string ImgUrl { get; set; }
        public Guid ObjectId { get; set; }
        public string Finger { get; set; }
        public long StudentId { get; set; }
    }
    
    [Table("student_fingerprint")]
    public class StudentFingerprint : BaseModel
    {
        [PrimaryKey]
        [Column("fingerprint_metadata_id")]
        public long FingerprintMetadataId { get; set; }

        [Column("hash")]
        public string Hash { get; set; }

        [Column("img_url")]
        public string ImgUrl { get; set; }

        [Column("object_id")]
        public Guid ObjectId { get; set; }

        [Column("finger")]
        public Fingerprint Finger { get; set; }

        [Column("student_id")]
        public long StudentId { get; set; }
    }

    public enum Fingerprint
    {
        R_THUMB,
        R_INDEX,
        R_MIDDLE,
        R_RING,
        R_PINKY,
        L_THUMB,
        L_INDEX,
        L_MIDDLE,
        L_RING,
        L_PINKY
    }
}