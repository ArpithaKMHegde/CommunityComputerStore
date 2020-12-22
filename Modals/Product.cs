using System;

namespace Modals
{
    public class Product
    {
        public int ProductId                { get; set; }
        public string ProductNumber         { get; set; }
        public string ProductName           { get; set; }
        public string ProductDescription    { get; set; }
        public string Brand                 { get; set; }
        public int MemberId                 { get; set; }
        public int InitialQuantity   { get; set; }
        public int RemainingQuantity        { get; set; }
        public double PricePerUnit          { get; set; }
        public int IsDeleted                { get; set; }

    }
}
