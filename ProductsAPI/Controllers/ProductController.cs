using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Modals;
using ProductsAPI.Data;

namespace ProductsAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
         private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }
        [HttpGet("{id}")]
        public Product Get(int id)
        {
            Product p = new ProductDataHandler().GetProducts().Where(x => x.ProductId == id).FirstOrDefault();
            return p == null? new Product(): p;
        }
        [HttpGet]
        public IEnumerable<Product> Get()
        {
            var vRet = new List<Product>();
            return new ProductDataHandler().GetProducts();
        }

        [HttpPost]
        public Product Post([FromBody] Product pProduct)
        {
            Product p = pProduct;
            try {

                p = new ProductDataHandler().SaveProduct(pProduct);
            }
            catch (Exception ex)
            {
                return null;
            }
            return p;
        }
    }
}
