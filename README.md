# okolina
Procedurally generated/simulated world game

## Thoughts/Ideas/Plans

### DB Structure

    rooms
      id,
      x_pos,
      y_pos,
      ...
      room information
      ...

    items
      id,
      name,
      ...
      item information
      ...

    users
      id,
      username,
      pasword_hash,
      salt,
      created_at,

    user_details
      user_id,
      current_room_id,
      ...
      user stats
      ...

    inventory_details
      user_id,
      item_id,
      quantity
