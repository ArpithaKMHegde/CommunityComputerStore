using System;
using System.Collections.Generic;
using System.Text;

namespace Modals
{
    public class Member
    {
        public int  MemberId        { get; set; }
        public string FirstName     { get; set; }
        public string LastName      { get; set; }
        public string Address       { get; set; }
        public string EmailId       { get; set; }
        public string ContactNumber { get; set; }
        public string StartDate     { get; set; }
        public string EndDate       { get; set; }
        public int IsDeleted { get; set; }
    }
}
