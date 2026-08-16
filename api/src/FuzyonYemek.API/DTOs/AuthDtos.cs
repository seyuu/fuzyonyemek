namespace FuzyonYemek.API.DTOs;

// ─── Auth DTOs ───
public record LoginRequest(string Email, string Password);
public record LoginResponse(string AccessToken, string RefreshToken, UserInfo User);
public record RefreshRequest(string AccessToken, string RefreshToken);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
public record UserInfo(Guid Id, string Email, string FullName, IList<string> Roles);
