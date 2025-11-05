using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BinaryPatrick.LockoutBuddy.Pages;

public partial class IndexModel(ILogger<IndexModel> logger) : PageModel
{
    private readonly Regex numbersOnly = NumbersOnlyRegex();
    
    [BindProperty]
    public string? PhoneNumber { get; set; }
    
    public string? ErrorMessage { get; set; }

    public void OnGet()
    {
        
    }
    
    public IActionResult OnPost()
    {
        if (string.IsNullOrWhiteSpace(PhoneNumber))
        {
            PhoneNumber = string.Empty;
            ErrorMessage = "Please enter a valid phone number";
            return Page();
        }
        
        string digits = numbersOnly.Replace(PhoneNumber, string.Empty);
        logger.LogInformation("{number}", digits);

        return Redirect($"/success?code={digits}");
    }

    [GeneratedRegex("[^0-9]")]
    private static partial Regex NumbersOnlyRegex();
}
