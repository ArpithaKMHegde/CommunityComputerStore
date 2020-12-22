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

namespace TransactionsAPI.Handlers
{
    public class UserDataHandler
    {
        public string ConnectionString = (new ConfigurationBuilder()).AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["UserBase"];
        public List<User> Users { get; set; }

        public List<User> GetUsers()
        {
            try
            {
                string StoreProcedureName = "GetUser";
                if (Users == null)
                {
                    Users = new List<User>();
                }
                DatabaseConnectAndExecute db = new DatabaseConnectAndExecute(ConnectionString);
                using (DbDataReader returnReader = db.GetDataReader(StoreProcedureName))
                {
                    while (returnReader.Read())
                    {
                        Users.Add(new User()
                        {
                            UserId = Convert.ToInt32(returnReader["UserId"]),
                            UserName = returnReader["UserName"].ToString(),
                            EncryptedAccessKey = returnReader["EncryptedAccessKey"].ToString()
                        });
                    }
                }
                return Users;
            }
            catch(Exception ex)
            {
                return new List<User>();
            }
        }

        public User SaveUser(User user)
        {
            string storeProcedureName = "SaveUser";
            DatabaseConnectAndExecute db = new DatabaseConnectAndExecute(ConnectionString);
            List<SqlParameter> parameters = new List<SqlParameter>();
            List<Tuple<string, Type, object>> param = new List<Tuple<string, Type, object>>();
            Tuple<string, Type, object> p = new Tuple<string, Type, object>("UserId", user.UserId.GetType(), user.UserId); param.Add(p);
            p = new Tuple<string, Type, object>("UserName", user.UserName.GetType(), user.UserName); param.Add(p);
            user.EncryptedAccessKey = user.EncryptedAccessKey ?? (user.UserName.Replace(" ", "") + "@123");
            p = new Tuple<string, Type, object>("EncryptedAccessKey", user.EncryptedAccessKey.GetType(), user.EncryptedAccessKey); param.Add(p);
            p = new Tuple<string, Type, object>("IsDeleted", user.IsDeleted.GetType(), user.IsDeleted); param.Add(p);
            parameters.Add(db.GetTableParameter("@UserItems", "UserType", param));

            using (DbDataReader returnReader = db.GetDataReader(storeProcedureName, parameters))
            {
                while (returnReader.Read())
                {
                    return new User()
                    {
                        UserId = Convert.ToInt32(returnReader["UserId"]),
                        UserName = returnReader["UserName"].ToString(),
                        EncryptedAccessKey = returnReader["EncryptedAccessKey"].ToString()
                    };
                }
            }
            return new User()
            {
                UserId = 0,
                UserName = "",
                EncryptedAccessKey = ""
            };
        }
    }
}
