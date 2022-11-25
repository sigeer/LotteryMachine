using System;
using System.Collections.Generic;
using System.Text;

namespace AutoChoosing.Core.DataBase
{
    public class DB_History
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
        public string Snapshot { get; set; }
    }
}
