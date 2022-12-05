using System.Linq;
using Utility.Extensions;

namespace LotteryMachine.Core
{
    public class LotteryMachineCore
    {
        public static bool Run(decimal target)
        {
            return target.IsWinner();
        }

        public static bool Run(params decimal[] targets)
        {
            var target = targets.Sum();
            return target.IsWinner();
        }
    }
}
