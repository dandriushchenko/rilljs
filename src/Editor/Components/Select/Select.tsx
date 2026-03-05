import React, { useContext, useEffect, useRef, useState } from 'react';
import { type BaseProps } from '../props';
import { mergeClasses, scrollIntoView } from '../utils';
import { InputField } from '../InputFIeld';
import { Menu } from '../Menu';
import { type Theme, ThemeContext } from '../../theme';
import { KeyNames } from '../keys';
import { MenuItem } from '../MenuItem';

export interface SelectItemRendererProps<I> extends BaseProps {
  item: I;
  onClick: (event: React.MouseEvent) => void;
}

export interface SelectProps<I> {
  items: I[];
  defaultSelected?: I;
  itemPredicate?: (item: I, filter: string) => boolean;

  itemRenderer?: React.FunctionComponent<SelectItemRendererProps<I>>;
  onSelect?: (item: I) => void;

  placeholder?: React.ReactNode;
}

function defaultItemRenderer<I>(props: SelectItemRendererProps<I>) {
  return <span onClick={props.onClick}>{String(props.item)}</span>;
}

export function Select<I>(props: SelectProps<I>) {
  const {
    items,
    placeholder,
    itemPredicate,
    itemRenderer: ItemRenderer = defaultItemRenderer,
    onSelect,
    defaultSelected,
  } = props;

  const theme = useContext<Theme>(ThemeContext).classes;
  const menuRef = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState('');
  const [activeItem, setActiveItem] = useState(() =>
    defaultSelected ? items.findIndex((i) => i === defaultSelected) : -1
  );

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  function onFilterChange(event: React.FormEvent<HTMLInputElement>) {
    setFilter(event.currentTarget.value);
    setActiveItem(0);
  }

  function handleClick(item: I) {
    return (event: React.SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (onSelect) {
        onSelect(item);
      }
    };
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === KeyNames.Up) {
      if (activeItem > 0) {
        setActiveItem(activeItem - 1);
      } else {
        setActiveItem(filtered.length - 1);
      }
    } else if (event.key === KeyNames.Down) {
      if (activeItem < filtered.length - 1) {
        setActiveItem(activeItem + 1);
      } else {
        setActiveItem(0);
      }
    } else if (event.key === KeyNames.Enter) {
      const validActiveItem = activeItem >= filtered.length ? 0 : activeItem;
      const item = filtered[validActiveItem];
      if (item && onSelect) {
        onSelect(item);
      }
    }
  }

  const filtered = !itemPredicate ? items : items.filter((i) => itemPredicate(i, filter));

  useEffect(() => {
    scrollIntoView(menuRef.current, activeItem);
  }, [activeItem, menuRef]);

  return (
    <>
      {itemPredicate && (
        <InputField
          value={filter}
          onChange={onFilterChange}
          autoFocus={true}
          placeholder='Filter...'
          tabIndex={1}
          fill={true}
          style={{
            marginBottom: 10,
          }}
          onKeyDown={onKeyDown}
        />
      )}
      {filtered.length > 0 ? (
        <Menu
          menuRef={menuRef}
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          {filtered.map((i, ii) => {
            const classes = mergeClasses({
              [theme.active]: ii === activeItem,
            });
            const clickHandler = handleClick(i);
            return (
              <MenuItem key={ii} onClick={clickHandler} className={classes}>
                <ItemRenderer item={i} onClick={clickHandler} />
              </MenuItem>
            );
          })}
        </Menu>
      ) : (
        (placeholder ?? <span className={theme.textMuted}>Nothing</span>)
      )}
    </>
  );
}
