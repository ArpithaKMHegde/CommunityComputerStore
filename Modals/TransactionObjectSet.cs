using System;
using System.Collections.Generic;
using System.Text;

namespace Modals
{
    public class TransactionObjectSet
    {
        public Transaction OTransaction { get; set; }
        public Sales Sale { get; set; }
        public SalesDetail[] SaleDetails { get; set; }
    }
}
