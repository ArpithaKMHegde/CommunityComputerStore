using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Modals
{
    public class User
    {
        public int UserId                   { get; set; }
        public string UserName              { get; set; }
        public string EncryptedAccessKey    { get; set; }
        public int IsDeleted { get; set; }
    }
    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class LoginStatus
    {
        public bool status { get; set; }
        public string message { get; set; }
    }
}
