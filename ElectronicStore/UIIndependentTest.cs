using Modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicStore
{
    public class UIIndependentTest
    {
        public static List<Product> Products { get; set; }
        public static List<Member> Members { get; set; }
        public static List<User> Users { get; set; }
        public static List<Transaction> Transactions { get; set; }

        public UIIndependentTest()
        {
            Products = new List<Product>();
            Members = new List<Member>();
            Users = new List<User>();
            Transactions = new List<Transaction>();
        }

        public void LoadTestData()
        {
            if (Products.Count <= 0)
            {
                Products.Add(new Product() { Brand = "HP",    MemberId = 1, PricePerUnit = 50, ProductDescription = "500GB HD, 16GB RAM ", ProductId = 1, ProductName = "Laptop 1", ProductNumber = "525356", IsDeleted = 0, RemainingQuantity = 10, InitialQuantity = 10 });
                Products.Add(new Product() { Brand = "Dell",  MemberId = 1, PricePerUnit = 60, ProductDescription = "1TB HD, 8GB RAM, 4GB Graphics Card", ProductId = 2, ProductName = "Laptop 2", ProductNumber = "525357", IsDeleted = 0, RemainingQuantity = 20, InitialQuantity = 20 });
                Products.Add(new Product() { Brand = "Apple", MemberId = 1, PricePerUnit = 70, ProductDescription = "500GB SSD, 8GB RAM, Core i5 Processor", ProductId = 3, ProductName = "Laptop 3", ProductNumber = "525358", IsDeleted = 0, RemainingQuantity = 30, InitialQuantity = 30 });
                Products.Add(new Product() { Brand = "Asus",  MemberId = 1, PricePerUnit = 80, ProductDescription = "500GB HD, 8GB RAM, Windows 8 OS", ProductId = 4, ProductName = "Laptop 4", ProductNumber = "525359", IsDeleted = 0, RemainingQuantity = 40, InitialQuantity = 40 });
            }

            if (Users.Count <= 0)
            {
                Users.Add(new User() { UserId = 1, UserName = "Administrator", EncryptedAccessKey = "2525625563" });
                Users.Add(new User() { UserId = 2, UserName = "FloorAttendee", EncryptedAccessKey = "2525625563" });
            }
            if (Members.Count <= 0)
            {

                Members.Add(new Member() { MemberId = 1, FirstName = "First",  Address = "Home at Long street",  ContactNumber = "0123456781", EmailId = "Member1@domain.com", EndDate = "", LastName = "Last1", StartDate = "01/01/2020" });
                Members.Add(new Member() { MemberId = 2, FirstName = "Second", Address = "Home at Long street",  ContactNumber = "0123456782", EmailId = "Member2@domain.com", EndDate = "", LastName = "Last2", StartDate = "02/01/2020" });
                Members.Add(new Member() { MemberId = 3, FirstName = "Buyer",  Address = "Home at Long street",  ContactNumber = "0123456783", EmailId = "Member3@domain.com", EndDate = "", LastName = "Last3", StartDate = "03/01/2020" });
                Members.Add(new Member() { MemberId = 4, FirstName = "Seller", Address = "Home at Long street",  ContactNumber = "0123456784", EmailId = "Member4@domain.com", EndDate = "", LastName = "Last4", StartDate = "04/01/2020" });

            }
            if (Transactions.Count <= 0)
            {
                Transactions.Add(new Transaction()
                {
                    TransactionId = 1,
                    PaymentType = "Cash",
                    TransactionDate = DateTime.Now,
                    TransactionStatus = 3,
                    Invoice = new Sales()
                    {
                        SalesId = 2, Items = new List<SalesDetail>(),
                        BuyingMember = Members[0], DiscountAmount = 0, ReceiptNumber = "1", SalesDateTime = DateTime.Now,
                    }
                });
                Transactions[0].Invoice.Items.Add(new SalesDetail()
                {
                    SalesDetailsId = 1, SoldProduct = Products[0], Quantity = 1
                });
            }
        }

        internal void AddProduct(Product pProduct)
        {
            pProduct.ProductId = Products.Max(x => x.ProductId) + 1;
            Products.Add(pProduct);
        }

        internal void AddMember(Member member)
        {
            member.MemberId = Members.Max(x => x.MemberId) + 1;
            Members.Add(member);
        }

        internal void AddUser(User user)
        {
            user.UserId = Users.Max(x => x.UserId) + 1;
            TestHash(user);
            Users.Add(user);
        }

        internal void TestHash(User u)
        {
            if(u !=null)
            u.EncryptedAccessKey = GetKey(u.UserName);
        }
        internal static string GetKey(string usr)
        {
            StringBuilder sb = new StringBuilder();
            usr.ToList().Select((y, i) => new { X = y, ij = i }).ToList().ForEach(x => sb.Append(Char.GetNumericValue(x.X).ToString().PadLeft(3, Convert.ToChar(x.ij))));
            return sb.ToString();
        }
    }
}
