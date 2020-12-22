using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MembersAPI.Handlers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Modals;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MembersAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly ILogger<MembersController> _logger;

        public MembersController(ILogger<MembersController> logger)
        {
            _logger = logger;
        }
        [HttpGet("{id}")]
        public Member Get(int id)
        {
            Member m = new MemberDataHandler().GetMembers().Where(x => x.MemberId == id).FirstOrDefault();
            return m == null ? new Member() : m;
        }
        [HttpGet]
        public IEnumerable<Member> Get()
        {
            var vRet = new List<Member>();
            return new MemberDataHandler().GetMembers();
        }

        // POST api/<MemberController>
        [HttpPost]
        public Member Post([FromBody] Member memberValue)
        {
            Member member = memberValue;
            try
            {
                member = new MemberDataHandler().SaveMember(memberValue);
            }
            catch (Exception ex)
            {

            }
            return member;
        }
    }
}
