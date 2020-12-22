using DatabaseConnect;
using Microsoft.Extensions.Configuration;
using Modals;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace TransactionsAPI.Data
{
    public class TransactionDataHandler
    {
        public string ConnectionString = (new ConfigurationBuilder()).AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["TransactionBase"];
        public List<Transaction> Transactions { get; set; }

        public List<Transaction> GetTransactions()
        {
            string StoreProcedureName = "GetTransaction";
            if (Transactions == null)
            {
                Transactions = new List<Transaction>();
            }
            DatabaseConnectAndExecute db = new DatabaseConnectAndExecute(ConnectionString);
            using (DbDataReader returnReader = db.GetDataReader(StoreProcedureName))
            {
                List<RawTransaction> RawTransactions = new List<RawTransaction>();
                while (returnReader.Read())
                {
                    RawTransactions.Add(new RawTransaction()
                    {
                        TransactionId = Convert.ToInt32(returnReader["TransactionId"].ToString()),
                        PaymentType = returnReader["PaymentType"].ToString(),
                        TransactionStatus = Convert.ToInt32(returnReader["TransactionStatus"].ToString()),
                        TransactionDate = Convert.ToDateTime(returnReader["TransactionDate"].ToString()),

                        SalesId = Convert.ToInt32(returnReader["SalesId"].ToString()),
                        MemberId = Convert.ToInt32(returnReader["MemberId"].ToString()),
                        FirstName = returnReader["FirstName"].ToString(),
                        SalesDateTime = Convert.ToDateTime(returnReader["SalesDateTime"]),
                        ReceiptNumber = returnReader["ReceiptNumber"].ToString(),
                        DiscountAmount = Convert.ToDouble(returnReader["DiscountAmount"].ToString()),

                        SalesDetailsId = Convert.ToInt32(returnReader["SalesDetailsId"].ToString()),
                        ProductId = Convert.ToInt32(returnReader["ProductId"].ToString()),
                        ProductNumber = returnReader["ProductNumber"].ToString(),
                        ProductName = returnReader["ProductName"].ToString(),
                        ProductDescription = returnReader["ProductDescription"].ToString(),
                        Brand = returnReader["Brand"].ToString(),
                        PricePerUnit = Convert.ToDouble(returnReader["UnitPrice"].ToString()),
                        Quantity = Convert.ToInt32(returnReader["Quantity"].ToString())
                    });
                }
                RawTransactions.ForEach(x => {
                    bool bExists = Transactions.Where(t => t.TransactionId == x.TransactionId).Count() > 0; 
                    Transaction tr = bExists ? Transactions.Where(t => t.TransactionId == x.TransactionId).FirstOrDefault() : new Transaction();
                    if (!bExists)
                    {
                        tr.TransactionId = x.TransactionId;
                        tr.TransactionStatus = x.TransactionStatus;
                        tr.PaymentType = x.PaymentType;
                        tr.TransactionDate = x.TransactionDate;

                    }
                    if (tr.Invoice == null) tr.Invoice = new Sales() {BuyingMember = new Member(), Items = new List<SalesDetail>() };

                    tr.Invoice.SalesId = x.SalesId ;
                    tr.Invoice.BuyingMember.MemberId = x.MemberId ;
                    tr.Invoice.BuyingMember.FirstName = x.FirstName ;
                    tr.Invoice.SalesDateTime = x.SalesDateTime;
                    tr.Invoice.ReceiptNumber =  x.ReceiptNumber;
                    tr.Invoice.DiscountAmount =  x.DiscountAmount;

                    tr.Invoice.Items.Add(new SalesDetail() { 
                        Quantity = x.Quantity, 
                        SalesDetailsId = x.SalesDetailsId, 
                        SoldProduct = new Product() { 
                            ProductId = x.ProductId,
                            Brand = x.Brand,
                            ProductDescription= x.ProductDescription,
                            PricePerUnit = x.PricePerUnit,
                            ProductName = x.ProductName,
                            ProductNumber = x.ProductNumber
                    } });
                    if (!bExists) Transactions.Add(tr);
                });
                 
            }
            return Transactions;
        }

        public Transaction SaveTransaction(Transaction pTransaction)
        {
            string StoreProcedureName = "SaveTransaction";
            DatabaseConnectAndExecute db = new DatabaseConnectAndExecute(ConnectionString);
            List<SqlParameter> parameters = new List<SqlParameter>();
            List<Tuple<string, Type, object>> param = new List<Tuple<string, Type, object>>();
            Tuple<string, Type, object> p = new Tuple<string, Type, object>("TransactionId", pTransaction.TransactionId.GetType(), pTransaction.TransactionId); param.Add(p);
            p = new Tuple<string, Type, object>("SalesId", pTransaction.Invoice.SalesId.GetType(), pTransaction.Invoice.SalesId); param.Add(p);
            p = new Tuple<string, Type, object>("TotalAmount", pTransaction.TotalAmount.GetType(), pTransaction.TotalAmount); param.Add(p);
            p = new Tuple<string, Type, object>("PaymentType", pTransaction.PaymentType.GetType(), pTransaction.PaymentType); param.Add(p);
            p = new Tuple<string, Type, object>("TransactionStatus", pTransaction.TransactionStatus.GetType(), pTransaction.TransactionStatus); param.Add(p);
            p = new Tuple<string, Type, object>("TransactionDate", pTransaction.TransactionDate.GetType(), pTransaction.TransactionDate); param.Add(p);
            p = new Tuple<string, Type, object>("IsDeleted", pTransaction.IsDeleted.GetType(), pTransaction.IsDeleted); param.Add(p);

            parameters.Add(db.GetTableParameter("@TransactionItems", "TransactionType", param));
                                            
            param = new List<Tuple<string, Type, object>>();
            p = new Tuple<string, Type, object>("SalesId", pTransaction.Invoice.SalesId.GetType(), pTransaction.Invoice.SalesId); param.Add(p);
            p = new Tuple<string, Type, object>("MemberId", pTransaction.Invoice.BuyingMember.MemberId.GetType(), pTransaction.Invoice.BuyingMember.MemberId); param.Add(p);
            p = new Tuple<string, Type, object>("SalesDateTime", pTransaction.Invoice.SalesDateTime.GetType(), pTransaction.Invoice.SalesDateTime); param.Add(p);
            p = new Tuple<string, Type, object>("ReceiptNumber", pTransaction.Invoice.ReceiptNumber.GetType(), pTransaction.Invoice.ReceiptNumber); param.Add(p);
            p = new Tuple<string, Type, object>("DiscountAmount", pTransaction.Invoice.DiscountAmount.GetType(), pTransaction.Invoice.DiscountAmount); param.Add(p);
            p = new Tuple<string, Type, object>("TotalBillAmount", pTransaction.Invoice.TotalBillAmount.GetType(), pTransaction.Invoice.TotalBillAmount); param.Add(p);
            p = new Tuple<string, Type, object>("IsDeleted", pTransaction.IsDeleted.GetType(), pTransaction.IsDeleted); param.Add(p);

            parameters.Add(db.GetTableParameter("@SalesItems", "SalesType", param));

            List<List<Tuple<string, Type, object>>> paramRows = new List<List<Tuple<string, Type, object>>>();
            pTransaction.Invoice.Items.ForEach(item => {
                param = new List<Tuple<string, Type, object>>(); paramRows.Add(param);
                Tuple<string, Type, object> p = new Tuple<string, Type, object>("SalesDetailsId", item.SalesDetailsId.GetType(), item.SalesDetailsId); param.Add(p);
                p = new Tuple<string, Type, object>("SalesId", pTransaction.Invoice.SalesId.GetType(), pTransaction.Invoice.SalesId); param.Add(p);
                p = new Tuple<string, Type, object>("ProductId", item.SoldProduct.ProductId.GetType(), item.SoldProduct.ProductId); param.Add(p);
                p = new Tuple<string, Type, object>("Quantity", item.Quantity.GetType(), item.Quantity); param.Add(p);
                p = new Tuple<string, Type, object>("UnitPrice", item.UnitPrice.GetType(), item.UnitPrice); param.Add(p);
                p = new Tuple<string, Type, object>("TotalPrice", item.TotalPrice.GetType(), item.TotalPrice); param.Add(p);
                p = new Tuple<string, Type, object>("IsDeleted", item.IsDeleted.GetType(), item.IsDeleted); param.Add(p);
            });
            parameters.Add(db.GetTableParameter("@SalesDetailsItems", "SalesDetailsType", paramRows));

            Transaction t = new Transaction();
            using (DbDataReader returnReader = db.GetDataReader(StoreProcedureName, parameters))
            {
                while (returnReader.Read())
                {

                    t.TransactionId = Convert.ToInt32(returnReader["TransactionId"]);
                    t.TotalAmount = Convert.ToDouble(returnReader["TotalBillAmount"]);
                    t.PaymentType = returnReader["PaymentType"].ToString();
                    t.TransactionStatus = Convert.ToInt32(returnReader["TransactionStatus"].ToString());
                    t.TransactionDate = Convert.ToDateTime(returnReader["TransactionDate"]);
                    if(t.Invoice == null)
                    t.Invoice = new Sales()
                    {
                        SalesId = Convert.ToInt32(returnReader["SalesId"].ToString()),
                        BuyingMember = new Member()
                        {
                            MemberId = Convert.ToInt32(returnReader["MemberId"].ToString()),
                            FirstName = returnReader["FirstName"].ToString()
                        },
                        SalesDateTime = Convert.ToDateTime(returnReader["SalesDateTime"]),
                        DiscountAmount = Convert.ToDouble(returnReader["DiscountAmount"]),
                        ReceiptNumber = returnReader["ReceiptNumber"].ToString(),
                        Items = new List<SalesDetail>()
                    };
                    t.Invoice.Items.Add(
                        new SalesDetail()
                        {
                            SalesDetailsId = Convert.ToInt32(returnReader["SalesDetailsId"]),
                            SoldProduct = new Product() { 
                                ProductId = Convert.ToInt32(returnReader["ProductId"]),
                                ProductNumber = returnReader["ProductNumber"].ToString(),
                                ProductName = returnReader["ProductName"].ToString(),
                                ProductDescription = returnReader["ProductDescription"].ToString(),
                                Brand = returnReader["Brand"].ToString(),
                            },
                            // = Convert.ToInt32(returnReader["UnitPrice"]),
                            Quantity = Convert.ToInt32(returnReader["Quantity"]),
                            //TotalPrice = Convert.ToDouble(returnReader["TotalPrice"]),
                        }
                    );
                }
            }
            return t;
        }
    }
}
