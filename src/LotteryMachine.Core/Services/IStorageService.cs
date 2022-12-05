using LotteryMachine.Core.Models;
using System.Collections.Generic;

namespace LotteryMachine.Core.Services
{
    public interface IStorageService
    {
        //��������
        void AddConfig(ConfigDto config);
        //�޸�����
        void EditConfig(ConfigDto config);
        //ɾ������
        void DeleteConfig(int id);
        //��ȡ����
        List<ConfigDto> GetConfigList();
        //�����¼
        void SaveHistory();
        //��ʷ��¼
    }
}
