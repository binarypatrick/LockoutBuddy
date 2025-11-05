using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BinaryPatrick.LockoutBuddy.Pages;

public class Success : PageModel
{
    public string? Code { get; set; }
    
    public void OnGet([FromQuery] string code)
    {
        this.Code = code;
    }
}
