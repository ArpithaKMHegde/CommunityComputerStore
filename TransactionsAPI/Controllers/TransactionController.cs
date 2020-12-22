using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Modals;
using TransactionsAPI.Data;

namespace TransactionsAPI.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class TransactionsController : ControllerBase
    {
         private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(ILogger<TransactionsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Transaction> Get()
        {
            var vRet = new List<Transaction>();
            return new TransactionDataHandler().GetTransactions();
        }

        [HttpPost]
        public Transaction Post([FromBody] Transaction pTransaction)
        {
            Transaction p = pTransaction;
            try {

               p = new TransactionDataHandler().SaveTransaction(pTransaction);
            }
            catch (Exception ex)
            { 
            
            }
            return p;
        }
    }
}
