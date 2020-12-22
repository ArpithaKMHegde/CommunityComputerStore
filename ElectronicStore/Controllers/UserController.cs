using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Modals;

namespace ElectronicStore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        public bool? bConnectToAPI = null;

        public UserController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            try
            {
                if (!bConnectToAPI.HasValue)
                {
                    string s = (new ConfigurationBuilder()).AddJsonFile("appsettings.json").Build().GetSection("CustomVariables")["ConnectToAPI"];


                    bConnectToAPI = string.IsNullOrEmpty(s) ? false : s == "Yes" ? true : false;
                }
                if (bConnectToAPI.Value)
                {
                    return APIHandler<IEnumerable<User>>.GetMethod("https://localhost:44318/Users");
                }
                else
                {
                    UIIndependentTest test = new UIIndependentTest();
                    test.LoadTestData();
                    return UIIndependentTest.Users.ToArray();
                }
            }
            catch (Exception ex)
            {
                UIIndependentTest test = new UIIndependentTest();
                test.LoadTestData();
                return UIIndependentTest.Users.ToArray();
            }
        }
        [HttpPost]
        public User post([FromBody] User user) 
        {

            try
            {
                if (!bConnectToAPI.HasValue)
                {
                    string s = (new ConfigurationBuilder()).AddJsonFile("appsettings.json").Build().GetSection("CustomVariables")["ConnectToAPI"];
                    bConnectToAPI = string.IsNullOrEmpty(s) ? false : s == "Yes" ? true : false;
                }
                if (bConnectToAPI.Value)
                {
                    return APIHandler<User>.PostMethod("https://localhost:44318/Users", user);
                }
                else
                {
                    UIIndependentTest test = new UIIndependentTest();
                    test.LoadTestData();
                    test.AddUser(user);
                    return user;
                }
            }
            catch (Exception ex)
            {
                UIIndependentTest test = new UIIndependentTest();
                test.LoadTestData();
                return UIIndependentTest.Users.FirstOrDefault();
            }

        }

        [HttpDelete]
        public User Delete([FromBody] User user)
        {
            try
            {
                if (!bConnectToAPI.HasValue)
                {
                    string s = (new ConfigurationBuilder()).AddJsonFile("appsettings.json").Build().GetSection("CustomVariables")["ConnectToAPI"];
                    bConnectToAPI = string.IsNullOrEmpty(s) ? false : s == "Yes" ? true : false;
                }
                if (bConnectToAPI.Value)
                {
                    user.IsDeleted = 1;
                    return APIHandler<User>.PostMethod("https://localhost:44318/Users", user);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return null;
        }
    }
}
