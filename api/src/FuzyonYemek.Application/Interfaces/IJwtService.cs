using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user, IList<string> roles);
    string GenerateRefreshToken();
    Guid? GetUserIdFromExpiredToken(string token);
}
