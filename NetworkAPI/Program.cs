var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    //.SetIsOriginAllowed(origin => true) // Allow any origin
    .WithOrigins("https://localhost:3000") // Allow only this origin
    .AllowCredentials()); // Allow credentials


app.Run();
