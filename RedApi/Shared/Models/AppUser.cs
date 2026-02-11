//using Microsoft.AspNetCore.Identity;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace RedApi.Shared.Models
//{
//    public class AppUser : IdentityUser
//    {
//        public string FullName { get; set; }
//        public string JobTitle { get; set; }
//        public string Department { get; set; }
//        public string Region { get; set; }
//        public string? ProfilePictureUrl { get; set; }

//        // === الجديد ===
//        public bool IsActive { get; set; } = true; // الافتراضي إنه شغال
//        public string? SignatureUrl { get; set; } // رابط صورة التوقيع
//        // =============

//        public string? ManagerId { get; set; }
//        [ForeignKey("ManagerId")]
//        public AppUser? Manager { get; set; }
//        public virtual ICollection<AppUser> Subordinates { get; set; }
//    }
//}