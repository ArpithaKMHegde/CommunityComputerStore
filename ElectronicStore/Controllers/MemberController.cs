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
    public class MemberController : ControllerBase
    {

        private readonly ILogger<MemberController> _logger;
        public bool? bConnectToAPI = null;

        public MemberController(ILogger<MemberController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Member> Get()
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
                    return APIHandler<IEnumerable<Member>>.GetMethod("https://localhost:44367/Members");
                }
                else
                {
                    UIIndependentTest test = new UIIndependentTest();
                    test.LoadTestData();
                    return UIIndependentTest.Members.ToArray();
                }
            }
            catch (Exception ex)
            {
                UIIndependentTest test = new UIIndependentTest();
                test.LoadTestData();
                return UIIndependentTest.Members.ToArray();
            }
        }

        [HttpPost]
        public Member post([FromBody] Member member)
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
                    return APIHandler<Member>.PostMethod("https://localhost:44367/Members", member);
                }
                else
                {
                    UIIndependentTest test = new UIIndependentTest();
                    test.LoadTestData();
                    test.AddMember(member);
                    return member;
                }
            }
            catch (Exception ex)
            {
                UIIndependentTest test = new UIIndependentTest();
                test.LoadTestData();
                return UIIndependentTest.Members.FirstOrDefault();
            }

        }

        [HttpDelete]
        public Member Delete([FromBody] Member member)
        {
            try
            {
                if(!bConnectToAPI.HasValue)
                {
                    string s = (new ConfigurationBuilder()).AddJsonFile("appsettings.json").Build().GetSection("CustomVariables")["ConnectToAPI"];
                    bConnectToAPI = string.IsNullOrEmpty(s) ? false : s == "Yes" ? true : false;
                }
                if(bConnectToAPI.Value)
                {
                    member.IsDeleted = 1;
                    return APIHandler<Member>.PostMethod("https://localhost:44367/Members", member);
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return null;
        }
    }
}
