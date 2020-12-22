using DatabaseConnect;
using Microsoft.Extensions.Configuration;
using Modals;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace MembersAPI.Handlers
{
    public class MemberDataHandler
    {
        public string ConnectionString = (new ConfigurationBuilder()).AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["MemberBase"];
        public List<Member> Members { get; set; }

        public List<Member> GetMembers()
        {
            try
            {
                string StoreProcedureName = "GetMember";
                if (Members == null)
                {
                    Members = new List<Member>();
                }
                DatabaseConnectAndExecute db = new DatabaseConnectAndExecute(ConnectionString);
                using (DbDataReader returnReader = db.GetDataReader(StoreProcedureName))
                {
                    while (returnReader.Read())
                    {
                        Members.Add(new Member()
                        {
                            MemberId = Convert.ToInt32(returnReader["MemberId"]),
                            FirstName = returnReader["FirstName"].ToString(),
                            LastName = returnReader["LastName"].ToString(),
                            Address = returnReader["Address"].ToString(),
                            EmailId = returnReader["EmailId"].ToString(),
                            ContactNumber = returnReader["ContactNumber"].ToString(),
                            StartDate = returnReader["StartDate"].ToString(),
                            EndDate = returnReader["EndDate"].ToString()
                        });
                    }
                }
                return Members;
            }
            catch (Exception ex)
            {
                return new List<Member>();
            }
        }

        public Member SaveMember(Member member)
        {
            string StoreProcedureName = "SaveMember";
            DatabaseConnectAndExecute db = new DatabaseConnectAndExecute(ConnectionString);
            List<SqlParameter> parameters = new List<SqlParameter>();
            List<Tuple<string, Type, object>> param = new List<Tuple<string, Type, object>>();
            Tuple<string, Type, object> p = new Tuple<string, Type, object>("MemberId", member.MemberId.GetType(), member.MemberId); param.Add(p);
            p = new Tuple<string, Type, object>("FirstName", member.FirstName.GetType(), member.FirstName); param.Add(p);
            p = new Tuple<string, Type, object>("LastName", member.LastName.GetType(), member.LastName); param.Add(p);
            p = new Tuple<string, Type, object>("Address", member.Address.GetType(), member.Address); param.Add(p);
            p = new Tuple<string, Type, object>("EmailId", member.EmailId.GetType(), member.EmailId); param.Add(p);
            p = new Tuple<string, Type, object>("ContactNumber", member.ContactNumber.GetType(), member.ContactNumber); param.Add(p);
            p = new Tuple<string, Type, object>("StartDate", member.StartDate.GetType(), member.StartDate); param.Add(p);
            p = new Tuple<string, Type, object>("EndDate", member.EndDate.GetType(), member.EndDate); param.Add(p);
            p = new Tuple<string, Type, object>("IsDeleted", member.IsDeleted.GetType(), member.IsDeleted); param.Add(p);
            parameters.Add(db.GetTableParameter("@MemberItems", "MemberType", param));

            using (DbDataReader returnReader = db.GetDataReader(StoreProcedureName, parameters))
            {
                while (returnReader.Read())
                {
                    return new Member
                    {
                        MemberId = Convert.ToInt32(returnReader["MemberId"]),
                        FirstName = returnReader["FirstName"].ToString(),
                        LastName = returnReader["LastName"].ToString(),
                        Address = returnReader["Address"].ToString(),
                        EmailId = returnReader["EmailId"].ToString(),
                        ContactNumber = returnReader["ContactNumber"].ToString(),
                        StartDate = returnReader["StartDate"].ToString(),
                        EndDate = returnReader["EndDate"].ToString()
                    };
                }
            }
            return new Member
            {
                MemberId = 0,
                FirstName = "",
                LastName = "",
                Address = "",
                EmailId = "",
                ContactNumber = "",
                StartDate = "",
                EndDate = ""
            };
        }
    }
}
