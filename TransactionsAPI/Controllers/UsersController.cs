using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Modals;
using TransactionsAPI.Handlers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TransactionsAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class UsersController : ControllerBase
    {
        private static List<User> Users = new List<User>();
        public static bool IsQueryDatabase = true;

        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            if(IsQueryDatabase)
            {
                Users = new UserDataHandler().GetUsers(); 
            }
            return Users;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public User Get(int id)
        {
            return Users.FirstOrDefault();
        }

        // POST api/<UserController>
        [HttpPost]
        public User Post([FromBody] User user)
        {
            User userobj = user;
            try
            {
                userobj = new UserDataHandler().SaveUser(user);
            }
            catch (Exception ex)
            {
                throw;
            }
            return userobj;
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
