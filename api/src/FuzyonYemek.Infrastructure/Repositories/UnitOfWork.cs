using System.Collections.Concurrent;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Infrastructure.Data;

namespace FuzyonYemek.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private readonly ConcurrentDictionary<string, object> _repositories = new();

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        var typeName = typeof(T).Name;
        return (IRepository<T>)_repositories.GetOrAdd(typeName, _ => new Repository<T>(_context));
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
