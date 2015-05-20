using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DataTools.Test
{
    [TestClass]
    public class ShapeFileTests
    {
        [TestMethod]
        [ExpectedException(typeof(System.IO.FileNotFoundException))]
        public void NonExistantFileExcepts()
        {
            var file = new ShapeFile("BlahBlah.die");
        }

        private const string testFileName = @"C:\Users\James\Downloads\westminster_const_region.shp";

        [TestMethod]
        public void CanCreateExistingFile()
        {
            // Need a sample shp file
            Assert.IsTrue(System.IO.File.Exists(testFileName), "Test Shape File Not Found: " + testFileName);
            var file = new ShapeFile(testFileName);
            Assert.AreEqual(testFileName, file.ShapeFileName);
        }

        #region ReadHeader
        [TestMethod]
        [ExpectedException(typeof(System.ArgumentOutOfRangeException))]
        public void ReadHeader_RejectsWrongLength()
        {
            var file = new ShapeFile("BlahBlah.die");

        }
        #endregion

        [TestMethod]
        public void CanOpenDBFFile()
        {
            var file = new ShapeFile(testFileName);
            var conn = file.GetDBFConnection();
            Assert.IsNotNull(conn, "Cannot get Connection Object.");

            conn.Open();
            conn.Close();
        }
    }
}
