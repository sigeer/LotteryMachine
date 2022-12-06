namespace LotteryMachine.Core.DataBase
{
    public class DB_Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        public int ConfigId { get; set; }
    }
}
