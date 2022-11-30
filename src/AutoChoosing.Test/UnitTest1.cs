using AutoChoosing.Core.Models;
using NuGet.Frameworks;
using Utility.Extensions;

namespace AutoChoosing.Test
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void Test1()
        {
            var m = new ModelBase()
            {
                Items = new List<ItemBase>
                {
                    new ItemBase()
                    {
                        Key = Guid.NewGuid(),
                        Name = "AAA",
                        Rate = 0.5m
                    },
                    new ItemBase()
                    {
                        Key = Guid.NewGuid(),
                        Name = "BBB",
                        Rate = 0.5m
                    }
                }
            };
            int count = 0;
            List<Guid> l1 = new List<Guid>();
            while (count < 10000)
            {
                var t = m.AutoSelectItem();
                if (l1.Count == 0 || l1.Contains(t.Key))
                    l1.Add(t.Key);
                count++;
            }
            Console.WriteLine(((decimal)l1.Count / (decimal)10000));
            Assert.IsTrue(((decimal)l1.Count / (decimal)10000).ToFixed(1) == 0.5m);
        }
    }
}