using System;
using System.Collections.Generic;
using System.Text;

namespace Modals
{
    public class RawTransaction
    {
        public int TransactionId { get; set; }
        public string PaymentType { get; set; }
        public int TransactionStatus { get; set; }
        public DateTime TransactionDate { get; set; }
        public int SalesId { get; set; }
        public int MemberId { get; set; }
        public string FirstName { get; set; }
        public DateTime SalesDateTime { get; set; }
        public string ReceiptNumber { get; set; }
        public double DiscountAmount { get; set; }
        public int SalesDetailsId { get; set; }
        public int ProductId { get; set; }
        public string ProductNumber { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public string Brand { get; set; }
        public double PricePerUnit { get; set; }
        public int Quantity { get; set; }
    }

}
