#pragma once

#include <string>

std::string json_escape(const std::string &s)
{
    std::string res;

    for (char c : s)
    {
        if (c == '\\')
            res += "\\\\";
        else if (c == '"')
            res += "\\\"";
        else if (c == '\n')
            res += "\\n";
        else if (c == '\r')
            res += "\\r";
        else if (c == '\t')
            res += "\\t";
        else
            res += c;
    }

    return res;
}
