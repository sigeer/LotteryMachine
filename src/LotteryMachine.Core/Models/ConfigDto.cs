using System;
using System.Collections.Generic;
using System.Text;

namespace LotteryMachine.Core.Models
{
    public class ConfigDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ConfigItem> Items { get; set; }
    }

    public class ConfigItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
    }
}
