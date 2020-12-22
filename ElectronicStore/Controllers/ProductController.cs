using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Modals;

namespace ElectronicStore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        
        private readonly ILogger<ProductController> _logger;
        public bool? bConnectToAPI = null;
        public ProductController(ILogger<ProductController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Product> Get()
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
                    return APIHandler<IEnumerable<Product>>.GetMethod("https://localhost:44303/Products");
                }
                else
                {
                    UIIndependentTest test = new UIIndependentTest();
                    test.LoadTestData();
                    return UIIndependentTest.Products.ToArray();
                }
            }
            catch (Exception ex)
            {
                UIIndependentTest test = new UIIndependentTest();
                test.LoadTestData();
                return UIIndependentTest.Products.ToArray();
            }
        }
        [HttpPost]
        public Product post([FromBody] Product pProduct) //string product
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
                    return APIHandler<Product>.PostMethod("https://localhost:44303/Products", pProduct);
                }
                else
                {
                    UIIndependentTest test = new UIIndependentTest();
                    test.LoadTestData();
                    test.AddProduct(pProduct);
                    return pProduct;
                }
            }
            catch (Exception ex)
            {
                UIIndependentTest test = new UIIndependentTest();
                test.LoadTestData();
                return UIIndependentTest.Products.FirstOrDefault();
            }
            
        }

        [HttpDelete]
        public Product Delete([FromBody] Product pProduct)
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
                    pProduct.IsDeleted = 1;
                    return APIHandler<Product>.PostMethod("https://localhost:44303/Products", pProduct);
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
