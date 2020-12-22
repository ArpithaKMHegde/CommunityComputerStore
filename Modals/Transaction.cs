using System;
using System.Collections.Generic;
using System.Text;

namespace Modals
{
    public class Transaction
    {
        private Double _TotalAmount = 0.0;
        public int TransactionId            { get; set; }
        public Sales Invoice                 { get; set; }
        public Double TotalAmount           { get { return  Invoice == null? _TotalAmount : Invoice.TotalBillAmount; } set { _TotalAmount = value; }  }
        public string PaymentType           { get; set; }
        public int TransactionStatus        { get; set; }
        public DateTime TransactionDate     { get; set; }
        public int IsDeleted { get; set; }
    }
    public class Sales
    {
        public int    SalesId               { get; set; }
        public Member BuyingMember       { get; set; }
        public DateTime SalesDateTime         { get; set; }
        public string ReceiptNumber         { get; set; }
        public double DiscountAmount        { get; set; }
        public List<SalesDetail> Items { get; set; }
        public double TotalBillAmount       { get
            {
                double d = 0.0;
                Items.ForEach(x => d += x.TotalPrice);
                return d - DiscountAmount;
            } 
        }
    }
    public class SalesDetail
    {
        public int SalesDetailsId           { get; set; }
        public Product SoldProduct          { get; set; }
        public int Quantity                 { get; set; }
        public double UnitPrice             { get 
            { 
                return SoldProduct.PricePerUnit; 
            } 
        }
        public double TotalPrice            { get 
            { 
                return SoldProduct.PricePerUnit * Quantity; 
            } 
        }
        public int IsDeleted { get; set; }
    }
    public class GetSingleItems
    {
        public int Id { get; set; }
        public string typeName { get; set; }
        public Product vProduct { get; set; }
        public Transaction vTransaction { get; set; }
        public Member vMember { get; set; }
        public User vUser { get; set; }
    }

}
