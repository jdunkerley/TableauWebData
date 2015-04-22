using System;
using System.Diagnostics;
using System.Net;
using System.Web.Mvc;

namespace Site.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Log(string message)
        {
            Debug.WriteLine(message);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}