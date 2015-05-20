using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTools
{
    public class ShapeFileHeader(int fileCode)
    {
        public int FileCode { get; } = fileCode;
    }

    public static class ShapeFileHeaderReader
    {

    }

    public static class BitConvertHelpers
    {
        /// <summary>
        ///
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="stream"></param>
        /// <param name="index"></param>
        /// <param name="isLittleEndian"></param>
        /// <param name="converter"></param>
        /// <returns></returns>
        public static T ReadEndianBlock<T>(IEnumerable<byte> stream, Func<byte[], int, T> converter, int index = 0, int length = 4, bool? isLittleEndian = null)
        {
            var block = stream.Skip(index).Take(length).ToArray();
            if (isLittleEndian.HasValue && isLittleEndian.Value != BitConverter.IsLittleEndian)
            {
                block = block.Reverse().ToArray();
            }

            return converter(block, 0);
        }

    }
}
