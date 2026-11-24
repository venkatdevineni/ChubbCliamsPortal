using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();
app.UseCors();

var claims = new ConcurrentDictionary<string, ClaimRecord>();
claims["CLM-1001"] = new("CLM-1001", "Aisha Rahman", "Motor", "Accident", "Kuala Lumpur", "2026-11-20", "Under Review", 12500, "Vehicle collision at junction", "Adjuster assigned; waiting for assessment.", "Officer: Daniel Wong");
claims["CLM-1002"] = new("CLM-1002", "Lim Wei Jun", "Property", "Water Damage", "Petaling Jaya", "2026-11-18", "Awaiting Documents", 8000, "Pipe leak in kitchen", "Please upload repair estimate and photos.", "Officer: Unassigned");
claims["CLM-1003"] = new("CLM-1003", "Maria Santos", "Motor", "Windshield", "Subang Jaya", "2026-11-16", "Approved", 2300, "Stone chip cracked windshield", "Approved for settlement.", "Officer: Daniel Wong");
claims["CLM-1004"] = new("CLM-1004", "Ravi Kumar", "Property", "Fire", "Shah Alam", "2026-11-15", "Submitted", 45000, "Electrical short circuit", "New claim received.", "Officer: Unassigned");
var events = new ConcurrentQueue<object>();
events.Enqueue(new { type = "ClaimSubmitted", claimId = "CLM-1001", occurredAt = DateTime.UtcNow.AddDays(-4) });
events.Enqueue(new { type = "ClaimSubmitted", claimId = "CLM-1002", occurredAt = DateTime.UtcNow.AddDays(-6) });

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", message = "Claims mock API is running" }));
app.MapGet("/api/claims", () => Results.Ok(claims.Values.OrderByDescending(c => c.Date).ToArray()));
app.MapGet("/api/claims/{id}", (string id) => { if (!claims.TryGetValue(id, out var claim)) return (IResult)Results.NotFound(); return Results.Ok(claim); });
app.MapPost("/api/claims", (CreateClaim request) => {
    var id = $"CLM-{Random.Shared.Next(1000, 9999)}";
    var claim = new ClaimRecord(id, request.Claimant, request.Type, request.Incident, request.Location, DateTime.UtcNow.ToString("yyyy-MM-dd"), "Submitted", request.EstimatedLoss, request.Description, "Your claim has been received. We will update you as it progresses.", "Officer: Unassigned");
    claims[id] = claim;
    events.Enqueue(new { type = "ClaimSubmitted", claimId = id, occurredAt = DateTime.UtcNow }); // Kafka-like event journal mock
    return Results.Created($"/api/claims/{id}", claim);
});
app.MapPatch("/api/claims/{id}/status", (string id, StatusUpdate update) => {
    if (!claims.TryGetValue(id, out var current)) return (IResult)Results.NotFound();
    var updated = current with { Status = update.Status, Update = update.Note ?? $"Status changed to {update.Status}.", Officer = update.Officer ?? current.Officer };
    claims[id] = updated;
    events.Enqueue(new { type = "ClaimStatusChanged", claimId = id, status = update.Status, occurredAt = DateTime.UtcNow });
    return Results.Ok(updated);
});
app.MapGet("/api/events", () => Results.Ok(events.ToArray()));
app.Run();


record ClaimRecord(string Id, string Claimant, string Type, string Incident, string Location, string Date, string Status, decimal EstimatedLoss, string Description, string Update, string Officer);
record CreateClaim(string Claimant, string Type, string Incident, string Location, decimal EstimatedLoss, string Description);
record StatusUpdate(string Status, string? Note, string? Officer);
