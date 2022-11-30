using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Utility.Extensions;

namespace AutoChoosing.Core.Models
{
    public class ModelBase
    {
        public virtual List<ItemBase> Items { get; set; }

        public virtual Guid Key { get; set; }
        public virtual string Name { get; set; }
        public virtual ItemBase AutoSelectItem()
        {
            if (!Validate())
                throw new InvalidOperationException();

            int maxDigCount = 0;
            Items.ForEach(x =>
            {
                maxDigCount = x.Rate.GetDigitCount().ToMax(maxDigCount);
            });
            int maxVal = (int)Math.Pow(10, maxDigCount);
            var random = (0, maxVal).ToRandom();
            int minRange = 0;
            int maxRange = 0;
            foreach (var item in Items)
            {
                var step = (int)(maxVal * item.Rate);
                maxRange += step;
                if (random >= minRange && random < maxRange)
                {
                    return item;
                }
                else
                {
                    minRange += step;
                }
            }
            throw new InvalidOperationException();
        }

        protected virtual bool Validate()
        {
            if (Items.Sum(x => x.Rate) != 1)
                return false;
            return true;
        }
    }

    public class ItemBase
    {
        public Guid Key { get; set; } 
        public string Name { get; set; }
        public decimal Rate { get; set; }
    }
}
