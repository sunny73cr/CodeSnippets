/*Usage:*/
string connectionString = ConnectionStringBuilder.Build();
Console.WriteLine($"Connection string is :\n{connectionString}");

public static class ConnectionStringBuilder
{
    private static string? Request(string Message)
    {
        Console.Write($"{Message}\t"); // \t to space inputs from outputs.
        return Console.ReadLine();
    }

    private static string? RequestPassword(string Message)
    {
        //https://stackoverflow.com/questions/3404421/password-masking-console-application

        Console.Write($"{Message}\t");
        var password = string.Empty;
        ConsoleKey key;
        do
        {
            var keyInfo = Console.ReadKey(intercept: true);
            key = keyInfo.Key;

            if (key == ConsoleKey.Backspace && password.Length > 0)
            {
                Console.Write("\b \b");
                password = password[0..^1];
            }
            else if (!char.IsControl(keyInfo.KeyChar))
            {
                Console.Write("*");
                password += keyInfo.KeyChar;
            }
        } while (key != ConsoleKey.Enter);

        return password;
    }

    public static string Build()
    {
        string? connectionString = null;

        while (connectionString == null)
        {
            string? hostAddress = Request("\nHost Address :"); // \n ewline first input to increase readability.
            string? hostPort = Request("Host Port :");
            string? databaseName = Request("Database name :");
            string? userName = Request("Username :");
            string? password = RequestPassword("Password :");

            List<string?> inputList = new()
            {
                hostAddress,
                hostPort,
                databaseName,
                userName,
                password
            };

            if (inputList.Any(item=> string.IsNullOrWhiteSpace(item) /*null, empty or whitespace*/))
            {
                Console.Write("\nUnable to complete the connection string...");
                switch (Request("Retry? y/N")) //capitalised indicates default.
                {
                    case "y": break;
                    case "Y": break;
                    case "yes": break;
                    case "YES": break;
                    default:
                        Console.WriteLine("Exiting...");
                        Environment.Exit(1);
                        break;
                }
            }
            else connectionString = $"server={hostAddress};port={hostPort};database={databaseName};user={userName};password={password};";
        }
        return connectionString;
    }
}