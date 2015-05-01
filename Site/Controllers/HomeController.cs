using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Site.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            Debug.WriteLine("Index Called");
            return View();
        }

        public ActionResult Quandl(string authKey = null, string searchCode = null)
        {
            ViewBag.AuthKey = authKey;
            ViewBag.SearchCode = searchCode;
            return View("Index");
        }

        public ActionResult Bikes()
        {
            return View();
        }

        private static object rawData;
        private static DateTime rawDataDate;

        [HttpPost]
        public async Task<ActionResult> GetBikesData()
        {
            if (DateTime.Now.Subtract(rawDataDate) > TimeSpan.FromMinutes(3))
            {
                var url = string.Format("http://api.tfl.gov.uk/BikePoint?app_id={0}&app_key={1}",
                    ConfigurationManager.AppSettings.Get("tflAppId"),
                    ConfigurationManager.AppSettings.Get("tflAppKey"));

                var clt = new WebClient();
                //var data = await clt.DownloadStringTaskAsync(new Uri(url));
                var data = await new StreamReader(Server.MapPath("~/Content/BikeData.txt")).ReadToEndAsync();
                var array = (JArray)JsonConvert.DeserializeObject(data);
                
                rawData = array.Cast<JObject>().Select(i => new
                {
                    id = int.Parse(((string)i["id"]).Substring(11)),
                    commonName = (string)i["commonName"],
                    terminalName = int.Parse(getAdditionalProperty(i, "TerminalName")),
                    latitude =(float)i["lat"],
                    longitude = (float)i["lon"],
                    installed = getAdditionalProperty(i, "Installed") == "true",
                    locked = getAdditionalProperty(i, "Locked") == "true",
                    installDate = getAdditionalDate(i, "InstallDate", new DateTime(2010,1,1)),
                    removalDate = getAdditionalDate(i, "RemovalDate", new DateTime(2099,12,31)),
                    temporary = getAdditionalProperty(i, "Temporary") == "true",
                    bikes = int.Parse(getAdditionalProperty(i, "NbBikes")),
                    spaces = int.Parse(getAdditionalProperty(i, "NbEmptyDocks")),
                    docks = int.Parse(getAdditionalProperty(i, "NbDocks")),
                    modified = (DateTime)((JArray)i["additionalProperties"]).Cast<JObject>().First()["modified"]
                }).ToArray();
                rawDataDate = DateTime.Now;
            }

            return Json(rawData);
        }

        private static DateTime getAdditionalDate(JObject parent, string key, DateTime def)
        {
            var value = ((string)((JArray)parent["additionalProperties"]).Cast<JObject>().Where(j => (string)j["key"] == key).First()["value"]);
            if (value == "") return def;
            return new DateTime(1970, 1, 1).AddMilliseconds(long.Parse(value));
        }

        private static string getAdditionalProperty(JObject parent, string key)
        {
            return ((string)((JArray)parent["additionalProperties"]).Cast<JObject>().Where(j => (string)j["key"] == key).First()["value"]);
        }

#if DEBUG 
        public ActionResult Log(string message)
        {
            Debug.WriteLine(message);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
#endif
    }
}