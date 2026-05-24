#include <exception>
#include <iostream>
#include <memory>
#include <string>

#include "registry.hpp"
#include "json_escape.hpp"

std::string read_stdin()
{
    std::string input;
    std::string line;

    while (getline(std::cin, line))
    {
        input += line;
        input += '\n';
    }

    return input;
}

int main(int argc, char **argv)
{
    if (argc != 2)
    {
        std::cout << "{\"status\":\"error\",\"message\":\"missing puzzle slug\"}\n";
        return 1;
    }

    try
    {
        std::string slug = argv[1];
        std::string input = read_stdin();

        std::unique_ptr<Puzzle> puzzle = make_puzzle(slug);

        puzzle->validate(input);

        std::string wrong_output = puzzle->wrong(input);
        std::string correct_output = puzzle->correct(input);

        bool accepted = wrong_output != correct_output;

        std::cout << "{";
        std::cout << "\"status\":\"ok\",";
        std::cout << "\"accepted\":" << (accepted ? "true" : "false") << ",";
        std::cout << "\"wrongOutput\":\"" << json_escape(wrong_output) << "\",";
        std::cout << "\"correctOutput\":\"" << json_escape(correct_output) << "\"";
        std::cout << "}\n";
    }
    catch (const std::exception &e)
    {
        std::cout << "{";
        std::cout << "\"status\":\"error\",";
        std::cout << "\"message\":\"" << json_escape(e.what()) << "\"";
        std::cout << "}\n";
        return 1;
    }

    return 0;
}
