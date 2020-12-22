using Modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace ElectronicStore.Controllers
{
    public class APIHandler<T> where T : class
    {
        public static T GetMethod(string completeURL)
        {
            
            using (var client = new HttpClient())
            {
                var response = client.GetAsync(completeURL); // http://192.168.0.1:915/api/Controller/Object

                response.Wait();

                if (response.IsCompletedSuccessfully == true)
                {
                    string res = response.Result.Content.ReadAsStringAsync().Result;
                    var content = JsonSerializer.Deserialize<T>(res);


                    return content;
                }
            }
            return null;
        }

        internal static T PostMethod(string completeURL, T pProduct)
        {
            using (var client = new HttpClient())
            {
                var buffer = System.Text.Encoding.UTF8.GetBytes(JsonSerializer.Serialize(pProduct));
                var byteContent = new ByteArrayContent(buffer);
                byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var response = client.PostAsync(completeURL, byteContent); // http://192.168.0.1:915/api/Controller/Object

                response.Wait();

                if (response.IsCompletedSuccessfully == true)
                {
                    string res = response.Result.Content.ReadAsStringAsync().Result;
                    var content = JsonSerializer.Deserialize<T>(res);
                    return content;
                }
            }
            return null;
        }
    }
}
