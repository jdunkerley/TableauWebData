using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.IO;
using System.Linq;

namespace DataTools
{

    /// <summary>
    /// Attempt To Parse Shape Files
    /// </summary>
    public class ShapeFile
    {
        public ShapeFile(string fileName)
        {
            if (!File.Exists(fileName))
            {
                throw new FileNotFoundException("Specified File Cannot Be Found", fileName);
            }

            // Remove Extension
            var dirPath = Path.GetDirectoryName(fileName);
            var noExt = Path.GetFileNameWithoutExtension(fileName);
            if (!File.Exists(Path.Combine(dirPath, noExt +".shp")))
            {
                throw new FileNotFoundException("Cannot find SHP file in same directory.");
            }
            if (!File.Exists(Path.Combine(dirPath, noExt + ".shx")))
            {
                throw new FileNotFoundException("Cannot find SHX file in same directory.");
            }
            if (!File.Exists(Path.Combine(dirPath, noExt + ".dbf")))
            {
                throw new FileNotFoundException("Cannot find DBF file in same directory.");
            }

            this.ShapeFileName = Path.Combine(dirPath, noExt + ".shp");
            this.IndexFileName = Path.Combine(dirPath, noExt + ".shx");
            this.DBFFileName = Path.Combine(dirPath, noExt + ".dbf");
        }

        /// <summary>
        /// SHP File
        /// </summary>
        public string ShapeFileName { get; }

        /// <summary>
        /// Index File Name
        /// </summary>
        public string IndexFileName { get; }

        /// <summary>
        /// Bytes   Type    Endianness  Usage
        ///  0– 3    int32  big         File code(always hex value 0x0000270a)
        ///  4–23    int32  big         Unused; five uint32
        /// 24–27    int32  big         File length(in 16-bit words, including the header)
        /// 28–31    int32  little      Version
        /// 32–35    int32  little      Shape type(see reference below)
        /// 36–67   double  little      Minimum bounding rectangle(MBR) of all shapes contained within the dataset; four doubles in the following order: min X, min Y, max X, max Y
        /// 68–83   double  little      Range of Z; two doubles in the following order: min Z, max Z
        /// 84–99   double  little      Range of M; two doubles in the following order: min M, max M
        /// </summary>
        /// <param name="stream">100 bytes of data</param>
        /// <returns></returns>
        public object ReadHeader(byte[] stream)
        {
            if (stream.Length != 100)
            {
                throw new ArgumentOutOfRangeException(nameof(stream), "Header should be 100 bytes.");
            }

            uint fileCode = ReadEndianBlock(stream, 0, true, BitConverter.ToUInt32);
            uint fileLength = ReadEndianBlock(stream, 24, true, BitConverter.ToUInt32);
            uint version = ReadEndianBlock(stream, 32, false, BitConverter.ToUInt32);
            uint shapeType = ReadEndianBlock(stream, 36, false, BitConverter.ToUInt32);
            return new
            {
                FileCode = fileCode,
                Length = fileLength,
                Version = version,
                ShapeType = shapeType
            };
        }

        /// <summary>
        /// Attributes File
        /// </summary>
        public string DBFFileName { get; }

        /// <summary>
        /// Open The Connection To The DBF File
        /// </summary>
        public OleDbConnection GetDBFConnection()
        /// <returns></returns>
        {
            var connectionString = $"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=\"{this.DBFFileName}\";Extended Properties=dBase III";
            return new OleDbConnection(connectionString);
        }
    }
}
