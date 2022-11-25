﻿using AutoChoosing.Core.Models;

namespace AutoChoosing.Core.Services
{
    public interface IStorageService
    {
        //新增设置
        void AddConfig(ConfigDto config);
        //修改设置
        void EditConfig(ConfigDto config);
        //删除设置
        void DeleteConfig(int id);
        //保存记录
        void SaveHistory();
        //历史记录
    }
}
