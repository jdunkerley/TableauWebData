using System.Diagnostics;
using System.Net;
using System.Web.Mvc;

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
            return View(nameof(Index));
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