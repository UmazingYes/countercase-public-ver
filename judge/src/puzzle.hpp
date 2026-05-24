#pragma once

#include <string>

class Puzzle
{
    public:
        virtual void validate(const std::string &input) = 0;
        virtual std::string wrong(const std::string &input) = 0;
        virtual std::string correct(const std::string &input) = 0;
        virtual ~Puzzle() {}
};

