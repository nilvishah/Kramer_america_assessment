import redis

# Connect to Redis (host='redis' because that's the Docker service name)
r = redis.Redis(host='redis', port=6379, decode_responses=True)

# Example: Set and get a value
r.set('test_key', 'hello from redis!')
value = r.get('test_key')
print('Value from Redis:', value)
