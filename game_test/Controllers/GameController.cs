using Microsoft.AspNetCore.Mvc;

namespace game_test.Controllers
{
    [Route("game")]
    [ApiController]
    public class GameController : ControllerBase
    {
        
        private readonly ILogger<GameController> _logger;

        public GameController(ILogger<GameController> logger)
        {
            _logger = logger;
        }

        [HttpGet("generateNumber/{min}/{max}")]
        public int GenerateNumber(int min, int max)
        {
            Random rand = new Random();
            return rand.Next(min, max);
        }

        [HttpGet("generateRange/{level}")]
        public IEnumerable<int> GenerateRange(string level)
        {
            Random rand = new Random();

            int firstNumber = rand.Next(0, 10);
            int lastNumber = firstNumber * 10;

            if (!string.IsNullOrEmpty(level) && level == "easy")
            {                                
                return new int[]
                {
                    firstNumber,
                    firstNumber + 10
                };
            }

            return new int[]
            {
                rand.Next(firstNumber, lastNumber),
                rand.Next(lastNumber + 1, (lastNumber + 3) * 2)
            };
        }
    }
}