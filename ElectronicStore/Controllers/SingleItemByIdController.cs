using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Modals;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ElectronicStore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SingleItemByIdController : ControllerBase
    {
        private readonly ILogger<SingleItemByIdController> _logger;
        public bool? bConnectToAPI = null;

        public SingleItemByIdController(ILogger<SingleItemByIdController> logger)
        {
            _logger = logger;
        }
        // GET: api/<SingleItemByIdController>
        [HttpPost]
        public GetSingleItems Get([FromBody] GetSingleItems items)
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
                    if (items.typeName == "product")
                    {
                        items.vProduct = APIHandler<Product>.GetMethod(("https://localhost:44303/Products/" + items.Id));
                        return items;
                    }
                    else if (items.typeName == "member")
                    {
                        items.vMember = APIHandler<Member>.GetMethod("https://localhost:44367/Members/" + items.Id);
                        return items;

                    }
                    return items;
                }
                else
                {
                    return items;
                }
            }
            catch (Exception ex)
            {
                return items;
            }

        }

    }
}
