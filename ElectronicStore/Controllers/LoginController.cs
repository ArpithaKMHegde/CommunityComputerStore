using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Modals;

namespace ElectronicStore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            UIIndependentTest test = new UIIndependentTest();
            test.LoadTestData();
            return UIIndependentTest.Users.ToArray();
        }

        [HttpPost]
        public LoginStatus Post([FromBody] LoginRequest user)
        {
            UIIndependentTest test = new UIIndependentTest();
            test.LoadTestData();
            User u = UIIndependentTest.Users.ToArray().Where(x => x.UserName == user.UserName).FirstOrDefault();
            test.TestHash(u);
            if (u == null)
            {
                return new LoginStatus() { message = "User name or password is not valid", status = false };
            }
            else
            {
                LoginStatus ret = new LoginStatus() { message = "Successfully logged in", status = true };
                if (u.EncryptedAccessKey != UIIndependentTest.GetKey(user.Password)) { ret.message = "User name or password is not valid"; ret.status = false; }
                return ret;
            }
        }
    }
}
