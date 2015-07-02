using System.Web;
using System.Web.Optimization;

namespace Site
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                      "~/Scripts/jdunkerley.js"));

            bundles.Add(new ScriptBundle("~/bundles/tableau").Include(
                "~/Scripts/tableau.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/site.css"));
        }
    }
}
