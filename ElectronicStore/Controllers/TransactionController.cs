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
    public class TransactionController : ControllerBase
    {

        private readonly ILogger<TransactionController> _logger;
        public bool? bConnectToAPI = null;

        public TransactionController(ILogger<TransactionController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Transaction> Get()
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
                    return APIHandler<IEnumerable<Transaction>>.GetMethod("https://localhost:44318/Transactions");
                }
                else
                {
                    UIIndependentTest test = new UIIndependentTest();
                    test.LoadTestData();
                    return UIIndependentTest.Transactions.ToArray();
                }
            }
            catch (Exception ex)
            {
                UIIndependentTest test = new UIIndependentTest();
                test.LoadTestData();
                return UIIndependentTest.Transactions.ToArray();
            }
        }
        [HttpPost]
        public Transaction Post([FromBody] Transaction pTransaction)
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
                    return APIHandler<Transaction>.PostMethod("https://localhost:44318/Transactions", pTransaction);
                }
                else
                {
                    //Product pProduct = JsonSerializer.Deserialize<Product>(product);
                    //UIIndependentTest test = new UIIndependentTest();
                    //test.LoadTestData();
                    //test.AddT(pProduct);
                    //return pProduct;
                }
            }
            catch (Exception ex)
            {
                //UIIndependentTest test = new UIIndependentTest();
                //test.LoadTestData();
                //return UIIndependentTest.Products.FirstOrDefault();
            }
            return null;
        }

        
    }
}
